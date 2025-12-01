const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true, // bisa dimatikan kalau tidak perlu debug
});

const videoInput = document.getElementById("videoInput");
const convertBtn = document.getElementById("convertBtn");
const loading = document.getElementById("loading");
const downloadBtn = document.getElementById("downloadBtn");

convertBtn.addEventListener("click", async () => {
    if (!videoInput.files[0]) {
        alert("Pilih file MP4 dulu Pro!");
        return;
    }

    loading.classList.remove("hidden");
    downloadBtn.classList.add("hidden");

    const file = videoInput.files[0];
    const fileName = "input.mp4";

    try {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }

        ffmpeg.FS("writeFile", fileName, await fetchFile(file));

        await ffmpeg.run(
            "-i", fileName,
            "-vn",
            "-acodec", "libmp3lame",
            "-b:a", "320k",
            "output.mp3"
        );

        const mp3Data = ffmpeg.FS("readFile", "output.mp3");

        const blob = new Blob([mp3Data.buffer], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);

        downloadBtn.href = url;
        downloadBtn.download = "converted.mp3";
        downloadBtn.classList.remove("hidden");

        loading.classList.add("hidden");

        downloadBtn.onclick = () => {
            downloadBtn.classList.add("clicked");
        };

    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan dalam konversi!");
        loading.classList.add("hidden");
    }
});
