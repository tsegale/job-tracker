import django_filters
from .models import JobApplication


class JobApplicationFilter(django_filters.FilterSet):
    status    = django_filters.MultipleChoiceFilter(choices=JobApplication.Status.choices)
    company   = django_filters.CharFilter(lookup_expr='icontains')
    role      = django_filters.CharFilter(lookup_expr='icontains')
    location  = django_filters.CharFilter(lookup_expr='icontains')
    created_after  = django_filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')

    class Meta:
        model  = JobApplication
        fields = ['status', 'company', 'role', 'location']
