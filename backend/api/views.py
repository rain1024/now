from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg
from .models import User, Feedback
from .serializers import (
    UserSerializer,
    UserLoginResponseSerializer,
    FeedbackSerializer,
    StatsSerializer
)
import json


@api_view(['POST'])
def signup(request):
    """
    POST /api/signup - Register new user
    """
    # Validate required fields
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response(
            {'error': 'Missing required fields'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate password length
    if len(password) < 6:
        return Response(
            {'error': 'Password must be at least 6 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'success': True, 'userId': user.id},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    """
    POST /api/login - User authentication
    """
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate input
    if not email or not password:
        return Response(
            {'error': 'Missing email or password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find user
    try:
        user = User.objects.get(email=email, password=password)
        # Return user data without password
        serializer = UserLoginResponseSerializer(user)
        return Response(
            {'success': True, 'user': serializer.data},
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST', 'GET'])
def feedback(request):
    """
    POST /api/feedback - Submit new feedback
    GET /api/feedbacks - Get all feedbacks
    """
    if request.method == 'POST':
        # Validate ratings
        ratings = request.data.get('ratings')
        if not ratings:
            return Response(
                {'error': 'Missing required ratings'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check required rating fields
        if not all(key in ratings for key in ['design', 'idea', 'usefulness']):
            return Response(
                {'error': 'Missing required ratings'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create feedback
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback_obj = serializer.save()
            return Response(
                {'success': True, 'id': feedback_obj.id},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        # Get all feedbacks
        feedbacks = Feedback.objects.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def stats(request):
    """
    GET /api/stats - Get feedback statistics
    """
    feedbacks = Feedback.objects.all()
    total = feedbacks.count()

    if total == 0:
        return Response({
            'total': 0,
            'averages': {'design': 0, 'idea': 0, 'usefulness': 0}
        })

    # Calculate averages manually since ratings are stored as JSON
    totals = {'design': 0, 'idea': 0, 'usefulness': 0}

    for feedback_obj in feedbacks:
        ratings = json.loads(feedback_obj.ratings_json)
        totals['design'] += ratings.get('design', 0)
        totals['idea'] += ratings.get('idea', 0)
        totals['usefulness'] += ratings.get('usefulness', 0)

    averages = {
        'design': f"{totals['design'] / total:.2f}",
        'idea': f"{totals['idea'] / total:.2f}",
        'usefulness': f"{totals['usefulness'] / total:.2f}"
    }

    return Response({
        'total': total,
        'averages': averages
    })
