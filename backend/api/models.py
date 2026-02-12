from django.db import models

class EbayCredential(models.Model):
    app_id = models.CharField(max_length=255)
    cert_id = models.CharField(max_length=255)
    user_token = models.TextField()
    refresh_token = models.TextField()

class OdooConfig(models.Model):
    url = models.CharField(max_length=255)
    db_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255)

class ProductMapping(models.Model):
    odoo_product_id = models.IntegerField(unique=True)
    ebay_sku = models.CharField(max_length=255)
    odoo_name = models.CharField(max_length=255)
    last_synced_at = models.DateTimeField(auto_now=True)
    STATUS_CHOICES = [
        ('Synced', 'Synced'),
        ('Error', 'Error'),
        ('OutOfSync', 'Out of Sync'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OutOfSync')

class SyncLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES = [
        ('Success', 'Success'),
        ('Failed', 'Failed'),
        ('Running', 'Running'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    sync_type = models.CharField(max_length=50) # Order, Product, Inventory
    message = models.TextField()

    class Meta:
        ordering = ['-timestamp']
