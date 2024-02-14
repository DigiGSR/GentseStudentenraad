<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<h2>File Upload</h2>

<form method="post" use:enhance enctype="multipart/form-data">
    <div class="group">
        <label for="file">Upload your file</label>
        <input
            type="file"
            id="file"
            name="fileToUpload"
            accept={[".jpg", ".jpeg", ".png", ".webp"].join(",")}
            required
        />
    </div>

    <button type="submit">Submit</button>
</form>
