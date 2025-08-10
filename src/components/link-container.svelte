<script lang="ts">
	import GithubIcon from "../assets/icons/pixelarticons:github.svelte";
	import LinkedInIcon from "../assets/icons/pixeliconlibrary:linkedin.svelte";
	import XIcon from "../assets/icons/pixeliconlibrary:x.svelte";
</script>

<section class="absolute bottom-4 left-4 flex gap-x-2">
	<a
		href="https://github.com/frsswq/"
		target="_blank"
		class=" inline-flex size-8 items-center justify-center bg-black"
		title="Github"
	>
		<GithubIcon className="size-6 text-white" />
	</a>
	<a
		href="https://www.linkedin.com/in/faris-saifuddin-wafiq-a22a74174/"
		target="_blank"
		class=" inline-flex size-8 items-center justify-center bg-black"
		title="LinkedIn"
	>
		<LinkedInIcon className="size-6 text-white" />
	</a>
	<a
		href="https://x.com/farisdotsaif"
		target="_blank"
		class=" inline-flex size-8 items-center justify-center bg-black"
		title="LinkedIn"
	>
		<XIcon className="size-6 text-white" />
	</a>
</section>
