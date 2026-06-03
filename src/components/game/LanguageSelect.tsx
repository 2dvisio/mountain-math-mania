import { LANGS, useI18n, type Lang } from "@/i18n";

interface Props {
  onPick: (lang: Lang) => void;
}

export function LanguageSelect({ onPick }: Props) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-lg rounded-2xl border-4 border-primary bg-card p-8 text-center shadow-2xl animate-pop">
        <div className="mb-3 text-5xl">🌍</div>
        <h2 className="text-3xl font-extrabold">{t("pickLanguage")}</h2>
        <p className="mt-2 text-muted-foreground">{t("pickLangSub")}</p>
        <div className="mt-6 grid gap-3">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => onPick(l.code)}
              className="btn-pixel flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-5 text-2xl font-extrabold text-primary-foreground"
            >
              <span className="text-3xl">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
