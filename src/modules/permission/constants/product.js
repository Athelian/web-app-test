// @flow
export const PRODUCT_EXPORT = 'product.products.export';
export const PRODUCT_FORM = 'product.products.form';
export const PRODUCT_CREATE = 'product.products.create';
export const PRODUCT_UPDATE = 'product.products.update';
export const PRODUCT_DELETE = 'product.products.delete';
export const PRODUCT_TASK_LIST = 'product.tasks.list';
export const PRODUCT_TASK_FORM = 'product.tasks.form';
export const PRODUCT_TASK_CREATE = 'product.tasks.create';
export const PRODUCT_TASK_UPDATE = 'product.tasks.update';
export const PRODUCT_TASK_DELETE = 'product.tasks.delete';
export const PRODUCT_DOCUMENT_EDIT = 'product.files.edit';
export const PRODUCT_DOCUMENT_DELETE = 'product.files.delete';
export const PRODUCT_SET_TASKS = 'product.products.setTasks';
export const PRODUCT_SET_ARCHIVED = 'product.products.setArchived';
export const PRODUCT_SET_NAME = 'product.products.setName';
export const PRODUCT_SET_SERIAL = 'product.products.setSerial';
export const PRODUCT_SET_JAN_CODE = 'product.products.setJanCode';
export const PRODUCT_SET_HS_CODE = 'product.products.setHsCode';
export const PRODUCT_SET_MATERIAL = 'product.products.setMaterial';
export const PRODUCT_SET_TASK_TEMPLATE = 'product.products.setTaskTemplate';
export const PRODUCT_SET_MILESTONE = 'product.products.setMilestone';
export const PRODUCT_SET_CUSTOM_FIELDS = 'product.products.setCustomFields';
export const PRODUCT_SET_CUSTOM_FIELDS_MASK = 'product.products.setCustomFieldsMask';
export const PRODUCT_SET_TAGS = 'product.products.setTags';
export const PRODUCT_SET_MEMO = 'product.products.setMemo';
export const PRODUCT_SET_FOLLOWERS = 'product.products.setFollowers';
export const PRODUCT_PROVIDER_FORM = 'product.productProviders.form';
export const PRODUCT_PROVIDER_LIST = 'product.productProviders.list';
export const PRODUCT_PROVIDER_GET = 'product.productProviders.get';
export const PRODUCT_PROVIDER_GET_UNIT_TYPE = 'product.productProviders.getUnitType';
export const PRODUCT_PROVIDER_GET_UNIT_PRICE = 'product.productProviders.getUnitPrice';
export const PRODUCT_PROVIDER_CREATE = 'product.productProviders.create';
export const PRODUCT_PROVIDER_UPDATE = 'product.productProviders.update';
export const PRODUCT_PROVIDER_TASK_LIST = 'product.productProviderTasks.list';
export const PRODUCT_PROVIDER_TASK_FORM = 'product.productProviderTasks.form';
export const PRODUCT_PROVIDER_TASK_CREATE = 'product.productProviderTasks.create';
export const PRODUCT_PROVIDER_TASK_UPDATE = 'product.productProviderTasks.update';
export const PRODUCT_PROVIDER_TASK_DELETE = 'product.productProviderTasks.delete';
export const PRODUCT_PROVIDER_SET_TASKS = 'product.productProviders.setTasks';
export const PRODUCT_PROVIDER_SET_TASK_TEMPLATE = 'product.productProviders.setTaskTemplate';
export const PRODUCT_PROVIDER_SET_MILESTONE = 'product.productProviders.setMilestone';

export const PRODUCT_PROVIDER_DOCUMENT_GET = 'product.productProviderFiles.get';
export const PRODUCT_PROVIDER_DOCUMENT_FORM = 'product.productProviderFiles.form';
export const PRODUCT_PROVIDER_DOCUMENT_EDIT = 'product.productProviderFiles.edit';
export const PRODUCT_PROVIDER_DOCUMENT_DOWNLOAD = 'product.productProviderFiles.download';
export const PRODUCT_PROVIDER_DOCUMENT_DELETE = 'product.productProviderFiles.delete';

export const PRODUCT_PROVIDER_SET_CUSTOM_FIELDS = 'product.productProviders.setCustomFields';
export const PRODUCT_PROVIDER_SET_CUSTOM_FIELDS_MASK =
  'product.productProviders.setCustomFieldsMask';
export const PRODUCT_PROVIDER_SET_NAME = 'product.productProviders.setName';
export const PRODUCT_PROVIDER_SET_TAGS = 'product.productProviders.setTags';
export const PRODUCT_PROVIDER_SET_MEMO = 'product.productProviders.setMemo';
export const PRODUCT_PROVIDER_SET_EXPORTER = 'product.productProviders.setExporter';
export const PRODUCT_PROVIDER_SET_INSPECTION_FEE = 'product.productProviders.setInspectionFee';
export const PRODUCT_PROVIDER_SET_ORIGIN = 'product.productProviders.setOrigin';
export const PRODUCT_PROVIDER_PACKAGE_SET_CAPACITY = 'product.productProviderPackages.setCapacity';
export const PRODUCT_PROVIDER_PACKAGE_SET_NAME = 'product.productProviderPackages.setName';
export const PRODUCT_PROVIDER_PACKAGE_SET_SIZE = 'product.productProviderPackages.setSize';
export const PRODUCT_PROVIDER_PACKAGE_SET_VOLUME = 'product.productProviderPackages.setVolume';
export const PRODUCT_PROVIDER_PACKAGE_SET_WEIGHT = 'product.productProviderPackages.setWeight';
export const PRODUCT_PROVIDER_SET_PRODUCTION_LEAD_TIME =
  'product.productProviders.setProductionLeadTime';
export const PRODUCT_PROVIDER_SET_SUPPLIER = 'product.productProviders.setSupplier';
export const PRODUCT_PROVIDER_SET_IMPORTER = 'product.productProviders.setImporter';
export const PRODUCT_PROVIDER_SET_UNIT_PRICE = 'product.productProviders.setUnitPrice';
export const PRODUCT_PROVIDER_SET_UNIT_SIZE = 'product.productProviders.setUnitSize';
export const PRODUCT_PROVIDER_SET_UNIT_TYPE = 'product.productProviders.setUnitType';
export const PRODUCT_PROVIDER_SET_UNIT_VOLUME = 'product.productProviders.setUnitVolume';
export const PRODUCT_PROVIDER_SET_UNIT_WEIGHT = 'product.productProviders.setUnitWeight';
export const PRODUCT_TASK_SET_APPROVABLE = 'product.tasks.setApprovable';
export const PRODUCT_TASK_SET_APPROVED = 'product.tasks.setApproved';
export const PRODUCT_TASK_SET_APPROVERS = 'product.tasks.setApprovers';
export const PRODUCT_TASK_SET_ASSIGNEES = 'product.tasks.setAssignees';
export const PRODUCT_TASK_SET_COMPLETED = 'product.tasks.setCompleted';
export const PRODUCT_TASK_SET_DESCRIPTION = 'product.tasks.setDescription';
export const PRODUCT_TASK_SET_DUE_DATE = 'product.tasks.setDueDate';
export const PRODUCT_TASK_SET_DUE_DATE_BINDING = 'product.tasks.setDueDateBinding';
export const PRODUCT_TASK_SET_ENTITY = 'product.tasks.setEntity';
export const PRODUCT_TASK_SET_IN_PROGRESS = 'product.tasks.setInProgress';
export const PRODUCT_TASK_SET_SKIPPED = 'product.tasks.setSkipped';
export const PRODUCT_TASK_SET_MEMO = 'product.tasks.setMemo';
export const PRODUCT_TASK_SET_NAME = 'product.tasks.setName';
export const PRODUCT_TASK_SET_REJECTED = 'product.tasks.setRejected';
export const PRODUCT_TASK_SET_START_DATE = 'product.tasks.setStartDate';
export const PRODUCT_TASK_SET_START_DATE_BINDING = 'product.tasks.setStartDateBinding';
export const PRODUCT_TASK_SET_TAGS = 'product.tasks.setTags';
export const PRODUCT_TASK_SET_TEMPLATE = 'product.tasks.setTaskTemplate';
export const PRODUCT_TASK_SET_MILESTONE = 'product.tasks.setMilestone';
export const PRODUCT_PROVIDER_TASK_SET_APPROVABLE = 'product.productProviderTasks.setApprovable';
export const PRODUCT_PROVIDER_TASK_SET_APPROVED = 'product.productProviderTasks.setApproved';
export const PRODUCT_PROVIDER_TASK_SET_APPROVERS = 'product.productProviderTasks.setApprovers';
export const PRODUCT_PROVIDER_TASK_SET_ASSIGNEES = 'product.productProviderTasks.setAssignees';
export const PRODUCT_PROVIDER_TASK_SET_COMPLETED = 'product.productProviderTasks.setCompleted';
export const PRODUCT_PROVIDER_TASK_SET_DESCRIPTION = 'product.productProviderTasks.setDescription';
export const PRODUCT_PROVIDER_TASK_SET_DUE_DATE = 'product.productProviderTasks.setDueDate';
export const PRODUCT_PROVIDER_TASK_SET_DUE_DATE_BINDING =
  'product.productProviderTasks.setDueDateBinding';
export const PRODUCT_PROVIDER_TASK_SET_ENTITY = 'product.productProviderTasks.setEntity';
export const PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS = 'product.productProviderTasks.setInProgress';
export const PRODUCT_PROVIDER_TASK_SET_SKIPPED = 'product.productProviderTasks.setSkipped';
export const PRODUCT_PROVIDER_TASK_SET_MEMO = 'product.productProviderTasks.setMemo';
export const PRODUCT_PROVIDER_TASK_SET_NAME = 'product.productProviderTasks.setName';
export const PRODUCT_PROVIDER_TASK_SET_REJECTED = 'product.productProviderTasks.setRejected';
export const PRODUCT_PROVIDER_TASK_SET_START_DATE = 'product.productProviderTasks.setStartDate';
export const PRODUCT_PROVIDER_TASK_SET_START_DATE_BINDING =
  'product.productProviderTasks.setStartDateBinding';
export const PRODUCT_PROVIDER_TASK_SET_TAGS = 'product.productProviderTasks.setTags';
export const PRODUCT_PROVIDER_TASK_SET_TEMPLATE = 'product.productProviderTasks.setTaskTemplate';
export const PRODUCT_PROVIDER_TASK_SET_MILESTONE = 'product.productProviderTasks.setMilestone';

export const PRODUCT_PROVIDER_PACKAGES_DELETE = 'product.productProviderPackages.delete';
export const PRODUCT_PROVIDER_SET_DEFAULT = 'product.productProviders.setDefaultPackage';
export const PRODUCT_PROVIDER_PACKAGES_CREATE = 'product.productProviderPackages.create';
export const PRODUCT_PROVIDER_PACKAGES_UPDATE = 'product.productProviderPackages.update';
