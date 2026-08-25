export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ipa_url, p12_base64, prov_base64, p12_password } = req.body;
  const GITHUB_PAT = process.env.GITHUB_PAT; 
  const REPO_OWNER = "doskryu-1234";
  const REPO_NAME = "OpenSideLoading";

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'trigger-sign',
        client_payload: { ipa_url, p12_base64, prov_base64, p12_password }
      })
    });

    if (!response.ok) throw new Error("GitHub API 요청 실패");

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
