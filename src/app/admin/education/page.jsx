'use client';

import ResourceList from '@/components/admin/ResourceList';
import { RESOURCE_SCHEMAS } from '@/components/admin/adminSchemas';

export default function AdminEducationPage() {
  return <ResourceList schema={RESOURCE_SCHEMAS.education} />;
}
