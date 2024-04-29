import ffmpeg from 'fluent-ffmpeg'

export function getAudioDurationFromStream(stream: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(stream, (err, metadata) => {
      if (err) {
        reject(err)
      } else {
        const durationInSeconds = metadata.format.duration
        resolve(durationInSeconds)
      }
    })
  })
}
