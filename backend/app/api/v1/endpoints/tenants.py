from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.tenant import Tenant, TenantCreate, TenantUpdate, TenantListResponse, TenantUsageStats, TenantConfig
from app.services.tenant_service import TenantService
from app.utils.logger import app_logger

router = APIRouter()


@router.post("/", response_model=Tenant, status_code=status.HTTP_201_CREATED)
def create_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_in: TenantCreate,
    current_user: User = Depends(get_current_active_user),
) -> Tenant:
    app_logger.info(f"User {current_user.id} creating tenant: {tenant_in.name}")
    service = TenantService(db)
    tenant = service.create_tenant(tenant_in)
    return tenant


@router.get("/{tenant_id}", response_model=Tenant)
def get_tenant(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Tenant:
    service = TenantService(db)
    tenant = service.get_tenant(tenant_id)
    if not tenant:
        app_logger.warning(f"Tenant not found: {tenant_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant


@router.get("/code/{code}", response_model=Tenant)
def get_tenant_by_code(
    code: str,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Tenant:
    service = TenantService(db)
    tenant = service.get_tenant_by_code(code)
    if not tenant:
        app_logger.warning(f"Tenant not found by code: {code}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant


@router.get("/", response_model=TenantListResponse)
def list_tenants(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
) -> TenantListResponse:
    service = TenantService(db)
    tenants, total = service.list_tenants(
        skip=skip, limit=limit, search=search, status_filter=status
    )
    return TenantListResponse(items=tenants, total=total, skip=skip, limit=limit)


@router.put("/{tenant_id}", response_model=Tenant)
def update_tenant(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    tenant_in: TenantUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Tenant:
    app_logger.info(f"User {current_user.id} updating tenant: {tenant_id}")
    service = TenantService(db)
    tenant = service.update_tenant(tenant_id, tenant_in)
    if not tenant:
        app_logger.warning(f"Tenant not found: {tenant_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant


@router.delete("/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tenant(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    app_logger.info(f"User {current_user.id} deleting tenant: {tenant_id}")
    service = TenantService(db)
    success = service.delete_tenant(tenant_id)
    if not success:
        app_logger.warning(f"Tenant not found: {tenant_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )


@router.get("/{tenant_id}/usage", response_model=TenantUsageStats)
def get_tenant_usage_stats(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> TenantUsageStats:
    service = TenantService(db)
    stats = service.get_usage_stats(tenant_id)
    if not stats:
        app_logger.warning(f"Tenant not found: {tenant_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return TenantUsageStats(**stats)


@router.get("/{tenant_id}/config", response_model=TenantConfig)
def get_tenant_config(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> TenantConfig:
    service = TenantService(db)
    config = service.get_tenant_config(tenant_id)
    if not config:
        app_logger.warning(f"Tenant not found: {tenant_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return TenantConfig(**config)


@router.get("/{tenant_id}/limits")
def check_tenant_limits(
    tenant_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    service = TenantService(db)
    limits = service.check_tenant_limits(tenant_id)
    if not limits.get("allowed"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=limits.get("reason", "Access denied"),
        )
    return limits
