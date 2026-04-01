from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count

from .models import JobApplication
from .serializers import JobApplicationSerializer, JobApplicationListSerializer
from .filters import JobApplicationFilter


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset           = JobApplication.objects.all()
    serializer_class   = JobApplicationSerializer
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class    = JobApplicationFilter
    search_fields      = ['company', 'role', 'location', 'notes']
    ordering_fields    = ['created_at', 'updated_at', 'company', 'role', 'date_applied']
    ordering           = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return JobApplicationListSerializer
        return JobApplicationSerializer

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Aggregate counts by status + total."""
        qs = JobApplication.objects.values('status').annotate(count=Count('id'))
        by_status = {item['status']: item['count'] for item in qs}

        # Ensure every status key is present
        all_statuses = {s.value: 0 for s in JobApplication.Status}
        all_statuses.update(by_status)

        return Response({
            'total': JobApplication.objects.count(),
            'by_status': all_statuses,
        })

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """Quick status-only update."""
        instance = self.get_object()
        new_status = request.data.get('status')
        valid = [s.value for s in JobApplication.Status]
        if new_status not in valid:
            return Response(
                {'status': f'Must be one of: {valid}'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.status = new_status
        instance.save(update_fields=['status', 'updated_at'])
        return Response(JobApplicationSerializer(instance).data)
