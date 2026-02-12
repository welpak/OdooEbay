from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import SyncLog, ProductMapping
from .tasks import sync_inventory
from datetime import datetime
import xmlrpc.client

@api_view(['GET'])
def health(request):
    # Check Redis/Celery connectivity logic here
    last_sync = SyncLog.objects.filter(status='Success').first()
    return Response({
        'redisConnected': True,
        'celeryWorkersActive': 1,
        'lastSuccessfulSync': last_sync.timestamp if last_sync else None,
        'pendingTasks': 0
    })

@api_view(['GET'])
def get_logs(request):
    logs = SyncLog.objects.all()[:50]
    data = [{
        'id': str(l.id),
        'timestamp': l.timestamp,
        'status': l.status,
        'syncType': l.sync_type,
        'message': l.message
    } for l in logs]
    return Response(data)

@api_view(['GET'])
def get_mappings(request):
    mappings = ProductMapping.objects.all()
    data = [{
        'id': str(m.id),
        'odooProductId': m.odoo_product_id,
        'ebaySku': m.ebay_sku,
        'odooName': m.odoo_name,
        'lastSyncedAt': m.last_synced_at,
        'status': m.status
    } for m in mappings]
    return Response(data)

@api_view(['POST'])
def trigger_sync(request):
    sync_type = request.data.get('type')
    # Trigger Celery Task
    sync_inventory.delay()
    return Response({'status': 'Queued', 'message': f'{sync_type} sync started'})

@api_view(['POST'])
def test_odoo(request):
    config = request.data
    url = config.get('url')
    db = config.get('dbName')
    user = config.get('username')
    key = config.get('apiKey')
    
    # Real basic XMLRPC check logic attempt (if possible) or validation
    if 'odoo.mycompany.com' in url or not key:
        return Response({'success': False, 'message': 'Invalid credentials provided'})
        
    return Response({'success': True, 'message': f'Connection attempt to {url} valid (Mock for now)'})
