import { createCmsPage } from "@/lib/cms/page-factory";

const { generateMetadata, CmsRoutePage } = createCmsPage("terms-conditions", "Terms & Conditions");

export { generateMetadata };
export default CmsRoutePage;
