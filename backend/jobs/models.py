from django.db import models


class JobApplication(models.Model):
    class Status(models.TextChoices):
        WISHLIST   = 'wishlist',   'Wishlist'
        APPLIED    = 'applied',    'Applied'
        INTERVIEW  = 'interview',  'Interview'
        OFFER      = 'offer',      'Offer'
        REJECTED   = 'rejected',   'Rejected'
        WITHDRAWN  = 'withdrawn',  'Withdrawn'

    # Core fields
    company        = models.CharField(max_length=255)
    role           = models.CharField(max_length=255)
    status         = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    location       = models.CharField(max_length=255, blank=True)
    job_url        = models.URLField(blank=True)
    salary_min     = models.PositiveIntegerField(null=True, blank=True)
    salary_max     = models.PositiveIntegerField(null=True, blank=True)
    notes          = models.TextField(blank=True)

    # Dates
    date_applied   = models.DateField(null=True, blank=True)
    date_interview = models.DateField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['status']),
            models.Index(fields=['company']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.role} @ {self.company} [{self.status}]"
