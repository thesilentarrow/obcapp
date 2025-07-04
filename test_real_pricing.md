# Real-Time Pricing Implementation Test

## Backend Changes Made:
1. **ServicesByCategoryView**: Extended to accept `brand` and `model` query parameters
2. **ServiceSerializer**: Added `real_price` and `display_price` fields with dynamic lookup
3. **Database Query**: Uses `annotate()` with `Subquery` for efficient pricing lookup

## Frontend Changes Made:
1. **ProductScreen**: 
   - Added AsyncStorage integration for car context
   - Extended service types to include real pricing fields
   - Added car selection UI components
   - Modified API calls to include brand/model parameters

2. **FuelSelectionScreen**: 
   - Saves car details to AsyncStorage for persistence

## Test Scenarios:

### Test 1: Without Car Selection
- Navigate to ProductScreen without selecting a car
- Should show services with fallback prices
- Should show "Select Your Car for Real-time Pricing" button

### Test 2: With Car Selection
- Complete car selection flow (City → Brand → Model → Fuel)
- Navigate to ProductScreen
- Should show services with real-time prices if available
- Should show "Pricing for: [Brand] [Model]" with "Change Car" button

### Test 3: API URL Example
```
# Without car context:
GET /api/services/categories/ac-service/

# With car context:
GET /api/services/categories/ac-service/?brand=Mercedes&model=C-Class
```

### Test 4: Database Query Logic
```python
# In ServicesByCategoryView:
real_price_subquery = ServicePrice.objects.filter(
    brand__iexact=brand,
    model__iexact=model,
    product_name__icontains=OuterRef('header'),
    is_active=True
).values('discounted_price')[:1]

services = services.annotate(
    real_price=Subquery(real_price_subquery)
)
```

## Expected Results:
1. Services should show real-time prices when car is selected
2. Fallback to service.price when no real-time price available
3. Green "Real-time" badge for services with dynamic pricing
4. Efficient database queries using annotation instead of N+1 queries

## Performance Optimizations:
1. Uses Django `Subquery` and `annotate()` for efficient database access
2. Single API call instead of multiple price lookups
3. AsyncStorage for persisting car selection across app sessions
4. Context-aware serialization for dynamic pricing

## Files Modified:
- Backend: `views.py`, `serializers.py`
- Frontend: `ProductScreen.tsx`, `FuelSelectionScreen.tsx`
