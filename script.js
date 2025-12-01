const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.7/dist/ffmpeg-core.js"
});

const inputVideo = document.getElementById("videoInput");
const convertBtn = document.getElementById("convertBtn");
const loading = document.getElementById("loading");
const downloadBtn = document.getElementById("downloadBtn");

convertBtn.addEventListener("click", async () => {

    if (!inputVideo.files.length) {
        alert("Pilih video MP4 dulu Pro!");
        return;
    }

    loading.classList.remove("hidden");
    downloadBtn.classList.add("hidden");

    const videoFile = inputVideo.files[0];
    const inputName = "video.mp4";
    const outputName = "audio.mp3";

    try {
        // Load FFmpeg WASM (besar 30MB)
        if (!ffmpeg.isLoaded()) {
            alert("Sedang memuat FFmpeg (30MB). Tunggu sebentar Pro!");
            await ffmpeg.load();
        }

        // Masukkan file ke sistem FFmpeg
        ffmpeg.FS("writeFile", inputName, await fetchFile(videoFile));

        // Proses convert
        await ffmpeg.run(
            "-i", inputName,
            "-vn",
            "-acodec", "libmp3lame",
            "-b:a", "320k",
            outputName
        );

        // Ambil hasil
        const data = ffmpeg.FS("readFile", outputName);
        const blob = new Blob([data.buffer], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);

        // Tampilkan tombol download
        downloadBtn.href = url;
        downloadBtn.download = "converted.mp3";
        downloadBtn.classList.remove("hidden");

        downloadBtn.onclick = () => {
            downloadBtn.classList.add("clicked");
        };

        loading.classList.add("hidden");

    } catch (e) {
        loading.classList.add("hidden");
        alert("Gagal convert. Mungkin ukuran video terlalu besar atau FFmpeg belum termuat sempurna.");
        console.error(e);
    }
});
