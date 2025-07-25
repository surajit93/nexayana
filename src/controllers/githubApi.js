/**
 * Fetches file paths from a given GitHub repository.
 *
 * @param {string} owner - GitHub username or org.
 * @param {string} repo - Repository name.
 * @param {string} [path=''] - Optional subdirectory path inside repo.
 * @returns {Promise<string[]>} Array of file paths.
 */
export async function fetchRepoFiles(owner, repo, path = '') {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn("Unexpected GitHub response structure:", data);
      return [];
    }

    return data.map(file => file.path);
  } catch (err) {
    console.error("GitHub API fetch error:", err.message);
    return [];
  }
}

