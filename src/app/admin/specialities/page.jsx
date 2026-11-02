'use client';

import ResourceList from '@/components/admin/ResourceList';
import { RESOURCE_SCHEMAS } from '@/components/admin/adminSchemas';

export default function AdminSpecialitiesPage() {
  return <ResourceList schema={RESOURCE_SCHEMAS.specialities} />;
}
