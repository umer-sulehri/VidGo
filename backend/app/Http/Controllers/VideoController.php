<?php

namespace App\Http\Controllers;

use App\Services\YtdlpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoController extends Controller
{
    protected YtdlpService $ytdlpService;

    public function __construct(YtdlpService $ytdlpService)
    {
        $this->ytdlpService = $ytdlpService;
    }

    /**
     * Extract video metadata from URL.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function extract(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            $metadata = $this->ytdlpService->extractMetadata($request->url);
            return response()->json($metadata);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Stream or download the video from a direct URL.
     * Note: This is an example of proxying the download.
     *
     * @param Request $request
     * @return StreamedResponse|\Illuminate\Http\JsonResponse
     */
    public function download(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'title' => 'required|string',
        ]);

        $videoUrl = $request->url;
        $title = $request->title;
        $extension = $request->input('ext', 'mp4');

        return new StreamedResponse(function () use ($videoUrl) {
            $handle = fopen($videoUrl, 'rb');
            if ($handle) {
                while (!feof($handle)) {
                    echo fread($handle, 8192);
                    flush();
                }
                fclose($handle);
            }
        }, 200, [
            'Content-Type' => 'video/' . $extension,
            'Content-Disposition' => 'attachment; filename="' . $title . '.' . $extension . '"',
        ]);
    }
}
