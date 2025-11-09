from django.core.management.base import BaseCommand
from api.models import User, Feedback
import json
import os
from datetime import datetime


class Command(BaseCommand):
    help = 'Load initial data from JSON files'

    def handle(self, *args, **options):
        # Get the path to the data directory
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
        data_dir = os.path.join(base_dir, 'data')

        users_file = os.path.join(data_dir, 'users.json')
        feedbacks_file = os.path.join(data_dir, 'feedbacks.json')

        # Load users
        if os.path.exists(users_file):
            self.stdout.write('Loading users...')
            with open(users_file, 'r') as f:
                users_data = json.load(f)

            users_created = 0
            for user_data in users_data:
                # Convert createdAt to created_at
                created_at = user_data.get('createdAt')
                if created_at:
                    created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))

                user, created = User.objects.get_or_create(
                    id=user_data['id'],
                    defaults={
                        'name': user_data['name'],
                        'email': user_data['email'],
                        'password': user_data['password'],
                    }
                )

                # Update created_at if it was provided
                if created_at:
                    user.created_at = created_at
                    user.save()

                if created:
                    users_created += 1
                    self.stdout.write(f'  Created user: {user.name} ({user.email})')

            self.stdout.write(self.style.SUCCESS(f'Successfully loaded {users_created} users'))
        else:
            self.stdout.write(self.style.WARNING(f'Users file not found: {users_file}'))

        # Load feedbacks
        if os.path.exists(feedbacks_file):
            self.stdout.write('\nLoading feedbacks...')
            with open(feedbacks_file, 'r') as f:
                feedbacks_data = json.load(f)

            feedbacks_created = 0
            for feedback_data in feedbacks_data:
                # Convert timestamp to datetime
                timestamp = feedback_data.get('timestamp')
                if timestamp:
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))

                feedback, created = Feedback.objects.get_or_create(
                    id=feedback_data['id'],
                    defaults={
                        'name': feedback_data.get('name', 'Anonymous'),
                        'ratings_json': json.dumps(feedback_data['ratings']),
                        'comments': feedback_data.get('comments', ''),
                        'language': feedback_data.get('language', 'en'),
                    }
                )

                # Update timestamp if it was provided
                if timestamp:
                    feedback.timestamp = timestamp
                    feedback.save()

                if created:
                    feedbacks_created += 1
                    self.stdout.write(f'  Created feedback from: {feedback.name}')

            self.stdout.write(self.style.SUCCESS(f'Successfully loaded {feedbacks_created} feedbacks'))
        else:
            self.stdout.write(self.style.WARNING(f'Feedbacks file not found: {feedbacks_file}'))

        self.stdout.write(self.style.SUCCESS('\nData loading complete!'))
