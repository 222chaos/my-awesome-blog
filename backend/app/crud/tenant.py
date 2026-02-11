from typing import Optional
from sqlalchemy.orm import Session
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


class CRUDTenant:
    def get(self, db: Session, id: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(Tenant.id == id).first()

    def get_by_slug(self, db: Session, slug: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(Tenant.slug == slug).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> list[Tenant]:
        return db.query(Tenant).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: TenantCreate) -> Tenant:
        obj_data = obj_in.model_dump()
        db_obj = Tenant(**obj_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: Tenant,
        obj_in: TenantUpdate
    ) -> Tenant:
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            setattr(db_obj, field, obj_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: str) -> bool:
        obj = db.query(Tenant).filter(Tenant.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False


tenant = CRUDTenant()
