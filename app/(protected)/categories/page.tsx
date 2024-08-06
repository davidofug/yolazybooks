const Page: React.FC<{}> = () => {
	return (
		<section>
			<h1>Categories</h1>
			<form>
				<input type="text" min="3" max="50" required />
				<input type="submit" value="Save" />
			</form>
		</section>
	);
};

export default Page;
