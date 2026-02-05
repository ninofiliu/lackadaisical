$ErrorActionPreference = 'Stop'
pnpm build
ntl deploy -d dist --prod
git commit -m "deploy $(date)" --allow-empty
git push