from rest_framework import serializers
from .models import User, Feedback
import json


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'createdAt']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'password': {'write_only': True}  # Don't return password in responses
        }

    def create(self, validated_data):
        # Generate ID based on timestamp (like Node.js)
        import time
        validated_data['id'] = str(int(time.time() * 1000))
        return super().create(validated_data)


class UserLoginResponseSerializer(serializers.ModelSerializer):
    """Serializer for login response (without password)"""
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'createdAt']


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Feedback model"""
    ratings = serializers.JSONField()

    class Meta:
        model = Feedback
        fields = ['id', 'name', 'ratings', 'comments', 'timestamp', 'language']
        read_only_fields = ['id', 'timestamp']

    def create(self, validated_data):
        # Generate ID based on timestamp (like Node.js)
        import time
        validated_data['id'] = str(int(time.time() * 1000))

        # Convert ratings dict to JSON string for storage
        ratings_data = validated_data.pop('ratings')
        validated_data['ratings_json'] = json.dumps(ratings_data)

        return super().create(validated_data)

    def to_representation(self, instance):
        """Convert model instance to dict, ensuring ratings is a dict"""
        representation = super().to_representation(instance)
        # Make sure ratings is returned as a dict
        if isinstance(instance.ratings_json, str):
            representation['ratings'] = json.loads(instance.ratings_json)
        return representation


class StatsSerializer(serializers.Serializer):
    """Serializer for statistics response"""
    total = serializers.IntegerField()
    averages = serializers.DictField()
