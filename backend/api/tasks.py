import time
from celery import shared_task
from .models import SyncLog

@shared_task
def sync_inventory():
    # Placeholder logic
    log = SyncLog.objects.create(status='Running', sync_type='Inventory', message='Starting sync...')
    time.sleep(2)
    # Logic would go here
    log.status = 'Success'
    log.message = 'Sync completed (Simulated)'
    log.save()
    return "Done"
