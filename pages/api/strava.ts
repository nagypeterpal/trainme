export default function handler(req, res) {
  const requestMethod = req.method;
  const body = JSON.parse(req);
  switch (requestMethod) {
    case "POST":
      res
        .status(200)
        .json({ message: `You submitted the following data: ${body}` });

export const config = {
  runtime: "edge",
};

export default (request: NextRequest) => {
  return NextResponse.json({
    name: `Hello, from ${request.url} I'm now an Edge Function!`,
  });
};
