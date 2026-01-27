ls raw | % {
  $dst = "./public/baseline/$($_.BaseName).mp4"
  if (Test-Path -Path $dst) { 
    echo "$dst already exists, skipping"
    continue
  }
  echo "converting $dst..."
  ffmpeg -i $_.FullName -profile:v baseline $dst
}