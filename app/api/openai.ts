import { getServerSideConfig } from "@/app/config/server";
import { ModelProvider } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { requestOpenai } from "./common";

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Databricks Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  const token = req.headers
    .get("Authorization")
    ?.trim()
    .replaceAll("Bearer ", "")
    .trim();
  const req_json = await req.json();

  try {
    return await fetch(
      `https://adb-6192355565634015.15.azuredatabricks.net/serving-endpoints/${req_json["model"]}/invocations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`token:${token}`),
        },
        body: JSON.stringify(req_json),
      },
    );
  } catch (e) {
    console.error("[Azure] ", e);
    return NextResponse.json(prettyObject(e));
  }
}
