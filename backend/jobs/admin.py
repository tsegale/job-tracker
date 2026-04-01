from django.contrib import admin
from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display   = ['company', 'role', 'status', 'location', 'date_applied', 'created_at']
    list_filter    = ['status']
    search_fields  = ['company', 'role', 'location']
    ordering       = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
