// 条目媒体编辑：展项抽屉和商品详情共用。增删立刻写库，不等表单保存。
import { useState } from "react";
import { Film, Trash2, Upload } from "lucide-react";
import { api, ApiError, type MediaRow } from "./api";
import { Confirm, Field, toast } from "./ui";

export function MediaField({
  itemId,
  media,
  onChange,
  emptyHint = "这条内容没有关联媒体。",
  hint,
  label,
  coverUrl,
  onSetCover,
}: {
  itemId: string;
  media: MediaRow[];
  onChange: (next: MediaRow[]) => void;
  emptyHint?: string;
  hint?: string;
  label?: string;
  /** 只有商品传：当前封面地址，和设为封面的动作 */
  coverUrl?: string | null;
  onSetCover?: (mediaId: string) => Promise<void>;
}) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [settingCover, setSettingCover] = useState<string | null>(null);
  // 封面排第一。老商品的封面可能不在媒体里（站内图），单独占第一格
  const coverInMedia = media.some((m) => m.url === coverUrl);
  const tiles = coverUrl && coverInMedia ? [...media.filter((m) => m.url === coverUrl), ...media.filter((m) => m.url !== coverUrl)] : media;

  async function setCover(mediaId: string) {
    if (!onSetCover) return;
    setSettingCover(mediaId);
    try {
      await onSetCover(mediaId);
      toast("封面已更换");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "更换失败");
    } finally {
      setSettingCover(null);
    }
  }

  async function removeMedia(mediaId: string) {
    setRemoving(null);
    try {
      await api.deleteMedia(mediaId);
      onChange(media.filter((m) => m.id !== mediaId));
      toast("已删除媒体");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "删除失败");
    }
  }

  async function addMediaByUrl(url: string) {
    if (!url.trim()) return;
    try {
      const kind = /mp4$/i.test(url) ? "video" : "image";
      const created = await api.addMedia(itemId, { url: url.trim(), kind });
      onChange([...media, { id: created.id, url: url.trim(), kind, alt: null, usage: null, sort: media.length }]);
      setMediaUrl("");
      toast("已添加媒体");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "添加失败");
    }
  }

  async function uploadMedia(file: File) {
    try {
      const uploaded = await api.upload(file);
      const kind = uploaded.type.startsWith("video") ? "video" : "image";
      // 必须用后端返回的真实 media id：假 id 移除时会 404
      const created = await api.addMedia(itemId, { url: uploaded.url, kind });
      onChange([...media, { id: created.id, url: uploaded.url, kind, alt: null, usage: null, sort: media.length }]);
      toast("已上传并关联");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "上传失败");
    }
  }

  return (
    <>
      <Field label={label ?? `媒体（${media.length}）`} hint={hint}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12 }}>
          {media.length === 0 && !coverUrl && <span className="field__hint">{emptyHint}</span>}
          {(tiles.length > 0 || coverUrl) && (
            <ul className="media-grid">
              {coverUrl && !coverInMedia && (
                <li className="media-tile">
                  <span className="media-tile__fig">
                    <img src={coverUrl} alt="封面" loading="lazy" />
                    <span className="media-tile__cover">封面</span>
                  </span>
                </li>
              )}
              {tiles.map((m) => {
                const isCover = m.url === coverUrl;
                return (
                  <li className="media-tile" key={m.id} title={m.url}>
                    <span className="media-tile__fig">
                      {m.kind === "image" ? (
                        <img src={m.url} alt={m.alt ?? ""} loading="lazy" />
                      ) : (
                        <span className="media-tile__video">
                          <Film size={24} strokeWidth={1.5} aria-hidden />
                          视频
                        </span>
                      )}
                      {isCover && <span className="media-tile__cover">封面</span>}
                      <button type="button" className="icon-btn media-tile__del" aria-label="删除这个媒体" title="删除" onClick={() => setRemoving(m.id)}>
                        <Trash2 size={16} strokeWidth={1.75} />
                      </button>
                    </span>
                    {onSetCover && !isCover && m.kind === "image" && (
                      <button type="button" className="btn btn-text btn-sm" disabled={settingCover !== null} onClick={() => void setCover(m.id)}>
                        {settingCover === m.id ? "更换中…" : "设为封面"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <input
              className="input"
              aria-label="媒体地址"
              placeholder="粘贴图片/视频 URL，回车添加"
              style={{ flex: "1 1 180px", width: "auto", minWidth: 0 }}
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void addMediaByUrl(mediaUrl);
              }}
            />
            <button type="button" className="btn" onClick={() => void addMediaByUrl(mediaUrl)}>
              添加
            </button>
            <label className="btn btn-tonal" style={{ cursor: "pointer" }}>
              <Upload size={16} strokeWidth={1.75} aria-hidden />
              上传
              <input
                type="file"
                accept="image/*,video/mp4"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadMedia(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </Field>

      <Confirm
        open={removing !== null}
        danger
        title="删除这个媒体？"
        desc="删除后不可恢复，只解除并移除这条关联记录。"
        confirmText="删除"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing) void removeMedia(removing);
        }}
      />
    </>
  );
}
