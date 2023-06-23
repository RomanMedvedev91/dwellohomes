interface IBody {
  query: string;
}

export const server = {
  fetch: async (body: IBody) => {
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};