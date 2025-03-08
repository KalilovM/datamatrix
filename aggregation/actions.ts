import Cookies from "js-cookie";

export const getNomenclatureOptions = async () => {
  const sessionCookie = Cookies.get("session");
  console.log(sessionCookie);
  const res = await fetch(`${process.env.NEXT_API_URL}/api/nomenclature`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${sessionCookie}`,
    },
  });

  if (!res.ok) {
    console.log(await res.json());
    throw new Error("Ошибка загрузки номенклатуры");
  }

  return res.json();
};

export const generatePackCode = async (data: {
  packCodes: string[];
  configurationId: string;
  nomenclatureId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_API_URL}/api/aggregations/generate-pack-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Ошибка генерации кода");

  return res.json();
};

export const validateCode = async (code: string) => {
  const res = await fetch(
    `${process.env.NEXT_API_URL}/api/codes/validate-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    },
  );

  return res.json();
};
