import { useEffect, useState } from 'react'
import { loadRegions, type RegionProvince } from '../../lib/regions'
import type { AddressInput } from '../../lib/shop/types'

type Props = {
  value: AddressInput
  onChange: (patch: Partial<AddressInput>) => void
  errors?: Record<string, string>
  idPrefix?: string
}

const TAGS = ['家', '公司', '学校', '其他']

// 源数据里这几个桶名太长，选择器里用一个短一点的显示名；值仍然写回原名。
function cityLabel(name: string): string {
  if (name === '省直辖县级行政区划') return '省直辖县（市）'
  if (name === '自治区直辖县级行政区划') return '自治区直辖县（市）'
  return name
}

export default function AddressFields({ value, onChange, errors = {}, idPrefix = 'addr' }: Props) {
  const [provinces, setProvinces] = useState<RegionProvince[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let alive = true
    loadRegions()
      .then((data) => {
        if (alive) setProvinces(data)
      })
      .catch(() => {
        if (alive) setLoadError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const province = provinces?.find((item) => item.n === value.province)
  const cities = province?.c ?? []
  const city = cities.find((item) => item.n === value.city)
  const districts = city?.d ?? []

  return (
    <div className="addr-fields">
      <div className="form-grid form-grid--two">
        <label className="field" htmlFor={idPrefix + '-name'}>
          <span className="field__label">收货人</span>
          <input
            id={idPrefix + '-name'}
            className="input"
            value={value.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="姓名"
            autoComplete="name"
            maxLength={20}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? idPrefix + '-name-error' : undefined}
          />
          {errors.name ? <span className="field__error" id={idPrefix + '-name-error'}>{errors.name}</span> : null}
        </label>

        <label className="field" htmlFor={idPrefix + '-phone'}>
          <span className="field__label">手机号</span>
          <input
            id={idPrefix + '-phone'}
            className="input"
            value={value.phone}
            onChange={(event) => onChange({ phone: event.target.value.replace(/\D/g, '').slice(0, 11) })}
            placeholder="11 位手机号"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? idPrefix + '-phone-error' : undefined}
          />
          {errors.phone ? <span className="field__error" id={idPrefix + '-phone-error'}>{errors.phone}</span> : null}
        </label>
      </div>

      <div className="form-grid form-grid--three">
        <label className="field" htmlFor={idPrefix + '-province'}>
          <span className="field__label">省 / 直辖市</span>
          <select
            id={idPrefix + '-province'}
            className="select"
            value={value.province}
            onChange={(event) => onChange({ province: event.target.value, city: '', district: '' })}
            disabled={!provinces}
            aria-invalid={Boolean(errors.region)}
          >
            <option value="">{provinces ? '请选择' : loadError ? '地区数据未加载' : '加载中…'}</option>
            {(provinces ?? []).map((item) => (
              <option key={item.n} value={item.n}>{item.n}</option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor={idPrefix + '-city'}>
          <span className="field__label">市 / 地区</span>
          <select
            id={idPrefix + '-city'}
            className="select"
            value={value.city}
            onChange={(event) => onChange({ city: event.target.value, district: '' })}
            disabled={!province}
          >
            <option value="">{province ? '请选择' : '先选省'}</option>
            {cities.map((item) => (
              <option key={item.n} value={item.n}>{cityLabel(item.n)}</option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor={idPrefix + '-district'}>
          <span className="field__label">区 / 县</span>
          <select
            id={idPrefix + '-district'}
            className="select"
            value={value.district}
            onChange={(event) => onChange({ district: event.target.value })}
            disabled={!city}
            aria-describedby={errors.region ? idPrefix + '-region-error' : undefined}
          >
            <option value="">{city ? '请选择' : '先选市'}</option>
            {districts.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {errors.region ? <span className="field__error" id={idPrefix + '-region-error'}>{errors.region}</span> : null}
        </label>
      </div>

      <label className="field" htmlFor={idPrefix + '-detail'}>
        <span className="field__label">详细地址</span>
        <textarea
          id={idPrefix + '-detail'}
          className="textarea"
          value={value.detail}
          onChange={(event) => onChange({ detail: event.target.value })}
          placeholder="街道、门牌号、楼栋 / 房间号"
          rows={3}
          maxLength={80}
          aria-invalid={Boolean(errors.detail)}
          aria-describedby={errors.detail ? idPrefix + '-detail-error' : undefined}
        />
        {errors.detail ? <span className="field__error" id={idPrefix + '-detail-error'}>{errors.detail}</span> : null}
      </label>

      <div className="form-grid form-grid--two">
        <label className="field" htmlFor={idPrefix + '-postcode'}>
          <span className="field__label">邮政编码 <em>选填</em></span>
          <input
            id={idPrefix + '-postcode'}
            className="input"
            value={value.postcode}
            onChange={(event) => onChange({ postcode: event.target.value.replace(/\D/g, '').slice(0, 6) })}
            placeholder="6 位邮编，如 525100"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            aria-invalid={Boolean(errors.postcode)}
            aria-describedby={errors.postcode ? idPrefix + '-postcode-error' : undefined}
          />
          {errors.postcode ? <span className="field__error" id={idPrefix + '-postcode-error'}>{errors.postcode}</span> : null}
        </label>

        <div className="field">
          <span className="field__label">地址标签</span>
          <div className="tag-picks" role="group" aria-label="地址标签">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={value.tag === tag ? 'is-on' : ''}
                onClick={() => onChange({ tag })}
                aria-pressed={value.tag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
