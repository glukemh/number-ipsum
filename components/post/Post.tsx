"use client";
import React, { useEffect, useState } from "react";

type PostProps = {
	slug: string;
};

const Post = ({ slug }: PostProps) => {
	const Post = React.lazy(() => import(`posts/${slug}.mdx`));

	return <Post />;
};

export default Post;
