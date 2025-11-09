from django.db import models
import json


class User(models.Model):
    """User model for authentication"""
    # Using string id to match Node.js behavior (timestamp-based IDs)
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Plaintext for now to match Node.js
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.email})"


class Feedback(models.Model):
    """Feedback model for storing user feedback"""
    # Using string id to match Node.js behavior (timestamp-based IDs)
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255, default='Anonymous')
    ratings_json = models.TextField()  # Store JSON as text
    comments = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    language = models.CharField(max_length=10, default='en')

    class Meta:
        db_table = 'feedbacks'
        ordering = ['-timestamp']

    def __str__(self):
        return f"Feedback from {self.name} at {self.timestamp}"

    @property
    def ratings(self):
        """Convert ratings_json to dict"""
        try:
            return json.loads(self.ratings_json)
        except:
            return {}

    @ratings.setter
    def ratings(self, value):
        """Convert dict to ratings_json"""
        self.ratings_json = json.dumps(value)
