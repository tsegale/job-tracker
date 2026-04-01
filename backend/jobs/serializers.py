from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = JobApplication
        fields = [
            'id', 'company', 'role', 'status', 'status_display',
            'location', 'job_url', 'salary_min', 'salary_max',
            'notes', 'date_applied', 'date_interview',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status_display']

    def validate(self, data):
        salary_min = data.get('salary_min')
        salary_max = data.get('salary_max')
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError(
                {'salary_max': 'salary_max must be greater than salary_min.'}
            )
        return data


class JobApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = JobApplication
        fields = [
            'id', 'company', 'role', 'status', 'status_display',
            'location', 'date_applied', 'created_at',
        ]
