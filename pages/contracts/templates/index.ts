import type { ContractResponse } from "./_templates";

export const getTemplates = async () => {
  const templates = await $fetch("/api/contracts/templates");
  return templates;
};

export const saveContract = async (
  json: any,
  htmlContent: string,
  templateId: number
) => {
  try {
    console.log(json, htmlContent, templateId);
    const response = await $fetch<ContractResponse>("/api/contracts", {
      method: "POST",
      body: {
        ...json,
        htmlContent,
        templateId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error saving contract:", error);
    return {
      success: false,
      error: "Error saving contract",
    };
  }
};
