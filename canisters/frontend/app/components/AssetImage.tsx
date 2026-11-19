import { useAssetUrl } from "../hooks/useAssetUrl";

interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export default function AssetImage({ src, ...props }: AssetImageProps) {
  const resolved = useAssetUrl(src);
  if (!resolved) return null;
  return <img src={resolved} {...props} />;
}
