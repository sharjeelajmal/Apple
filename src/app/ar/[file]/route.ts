import { AR_MODEL_EXTENSION } from "@/config/arModels";
import { getProductByHandle } from "@/lib/catalog";
import { getArModelDownloadUrl } from "@/lib/cloudinary";

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(_request: Request, { params }: RouteContext<"/ar/[file]">) {
  const { file } = await params;
  if (!file.endsWith(AR_MODEL_EXTENSION)) return notFound();

  const product = await getProductByHandle(file.slice(0, -AR_MODEL_EXTENSION.length));
  const downloadUrl = product?.arModel && getArModelDownloadUrl(product.arModel);
  if (!downloadUrl) return notFound();

  const model = await fetch(downloadUrl);
  if (!model.ok || !model.body) return notFound();

  const headers = new Headers({
    "Content-Type": "model/vnd.usdz+zip",
    "Cache-Control": "public, max-age=86400, s-maxage=604800",
  });
  const size = model.headers.get("content-length");
  if (size) headers.set("Content-Length", size);

  return new Response(model.body, { headers });
}
