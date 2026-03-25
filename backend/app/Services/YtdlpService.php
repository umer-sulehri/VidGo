<?php

namespace App\Services;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class YtdlpService
{
    /**
     * Extract metadata from a video URL.
     *
     * @param string $url
     * @return array
     * @throws \Exception
     */
    public function extractMetadata(string $url): array
    {
        $process = new Process([
            'yt-dlp', 
            '--dump-json', 
            '--no-playlist', 
            '--no-check-certificates',
            '--no-call-home',
            '--no-warnings',
            $url
        ]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \Exception('Failed to extract metadata: ' . $process->getErrorOutput());
        }

        $output = json_decode($process->getOutput(), true);

        if (!$output) {
            throw new \Exception('Failed to parse metadata output.');
        }

        return $this->formatMetadata($output);
    }

    /**
     * Format the raw yt-dlp output into a cleaner structure.
     *
     * @param array $data
     * @return array
     */
    protected function formatMetadata(array $data): array
    {
        $formats = [];

        if (isset($data['formats'])) {
            foreach ($data['formats'] as $format) {
                // Filter for common video formats with audio or specific high quality
                if (isset($format['height']) && isset($format['url'])) {
                    $formats[] = [
                        'format_id'   => $format['format_id'],
                        'extension'   => $format['ext'],
                        'resolution'  => $format['height'] . 'p',
                        'note'        => $format['format_note'] ?? '',
                        'filesize'    => $format['filesize'] ?? ($format['filesize_approx'] ?? null),
                        'url'         => $format['url'],
                        'has_video'   => strpos($format['vcodec'], 'none') === false,
                        'has_audio'   => strpos($format['acodec'], 'none') === false,
                    ];
                }
            }
        }

        return [
            'id'          => $data['id'] ?? '',
            'title'       => $data['title'] ?? 'Unknown Title',
            'description' => $data['description'] ?? '',
            'thumbnail'   => $data['thumbnail'] ?? '',
            'duration'    => $data['duration'] ?? 0,
            'uploader'    => $data['uploader'] ?? '',
            'formats'     => array_values(array_filter($formats, fn($f) => $f['has_video'] && $f['has_audio'])),
            'raw_url'     => $data['webpage_url'] ?? '',
        ];
    }
}
