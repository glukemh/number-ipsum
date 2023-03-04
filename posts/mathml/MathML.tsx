const formattedMathML = `<math>
  <mrow>
    <msup>
      <mi>x</mi> <mn>2</mn>
    </msup>
    <mo>+</mo> <mn>5</mn> <mo>=</mo> <mn>0</mn>
  </mrow>
</math>`;

const MathML = () => {
	return (
		<article>
			<h1>Learning MathML</h1>
			<p>
				MathML is a markup language for describing mathematical notation and
				capturing both its structure and content. The standard makes it possible
				to publish mathematical notation and content in a form that can be
				rendered by browsers and other applications while being accessible to
				screen readers and assistive technologies.
			</p>
			<p>
				MathML Core is a subset of MathML that is now supported by _all major
				browsers. It took a while, but as of January 2023, MathML has finally
				returned to Chrome in version 109 a decade later, after having been
				removed all the way back in 2013.
			</p>
			<h2>Math in HTML</h2>
			<p>
				One way to use MathML is to include it directly in an HTML document.
				This can be done using the <code>{"<math>"}</code> element, which is
				used to wrap MathML code:
			</p>
			<pre>
				<code>{formattedMathML}</code>
			</pre>
			<p>will render as the following:</p>
			<math>
				<mrow>
					<msup>
						<mi>x</mi> <mn>2</mn>
					</msup>
					<mo>+</mo> <mn>5</mn> <mo>=</mo> <mn>0</mn>
				</mrow>
			</math>
		</article>
	);
};

export default MathML;
