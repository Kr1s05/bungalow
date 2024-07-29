package auth

import (
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type Introspect struct {
	Active bool `json:"active"`
}

func AuthenticationMiddleware() gin.HandlerFunc {
	client_id := os.Getenv("CLIENT_ID")
	client_secret := os.Getenv("CLIENT_SECRET")
	introspect_endpoint := os.Getenv("INTROSPECT_ENDPOINT")
	endpoint_auth := "Basic " + base64.URLEncoding.EncodeToString([]byte(client_id+":"+client_secret))
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}

	fmt.Println(client_id, client_secret, introspect_endpoint, endpoint_auth)

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token is required"})
			c.Abort()
			return
		}

		tokenPayload := url.Values{}
		tokenPayload.Set("token", tokenString)
		r, _ := http.NewRequest("POST", introspect_endpoint, strings.NewReader(tokenPayload.Encode()))
		r.Header.Set("Authorization", endpoint_auth)
		r.Header.Set("Accept", "application/json")
		r.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		res, err := client.Do(r)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error querying introspection endpoint.", "error": err})
			c.Abort()
			return
		}
		defer res.Body.Close()
		status := &Introspect{}
		err = json.NewDecoder(res.Body).Decode(status)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding introspection response."})
			c.Abort()
			return
		}
		if !status.Active {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token."})
			c.Abort()
			return
		}
		c.Next()
	}
}
