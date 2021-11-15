# divify

Divify is a simple library to create a nicer syntax to build trees of elements in HTML.  It's sort of similar to [pug](https://pugjs.org/language/plain-text.html) but with a different philosophy.

For example, go from

	<div class="ui card">
	  <div class="image">
		<img src="/images/avatar2/large/kristy.png">
	  </div>
	  <div class="content">
		<a class="header" id="name">Kristy</a>
		<div class="meta">
		  <span class="date">Joined in 2013</span>
		</div>
		<div class="description">
		  Kristy is an art director living in New York.
		</div>
	  </div>
	  <div class="extra content" style="color: blue;">
		<a>
		  <i class="user icon"></i>
		  22 Friends
		</a>
	  </div>
	</div>
	
To 

	<div class="divified">
		.ui .card {   
			.image { img src="/images/avatar2/large/kristy.png" {} }
			.content {
				.header #name a { "Kristy" }
				.meta { .date span { "Joined in 2013" } }
				.description { "Kristy is an art director living in New York" }
			}
			.extra .content {
				a {
					.user .icon i {}
					"22 Friends"
				}
			}
		}
	</div>

This is just syntactic sugar, but the syntactic sugar is MUCH more readable with a much higher signal to noise ratio.
This is really useful for quickly prototyping designs (which can be copied as HTML in production) OR used directly in production!

## Syntax 
The overall syntax is `<token1> <token2> ... <token3> {}` for each element, where token can be 
1) a css selector: 
	* `.class`. ..e.g. then this token is added to the class list for the element
	* `tag`: then the html tag of this element is overridden to `tag`.  Default is `div`
	* `#id` : then the html id of this element is overriden to `id`.
3) `identifier=value` this is then added as an attribute to the element
4) `[<css>]` then the css inside `[]` is added as an inline style attribute.

These two constructs can be nested.  Also, Anything inside `"..."` is emitted directly as HTML at that point in the tree.  (If you need to emit "", then you can use backslash to escape it)

Here's a breakdown of the above example:

    <div class="divified">  
		//Divify supports C-style comments
		.ui .card {   //makes <div class="ui card"></div>
		
			.image { img src="/images/avatar2/large/kristy.png" {} } //make an img element
			.content {
				.header #name a { "Kristy" } //id=name
				.meta { .date span { "Joined in 2013" } }
				.description { "Kristy is an art director living in New York" }
			}
			.extra .content [color: blue] { //add an inline style
				a {
					.user .icon i {}
					"22 Friends"
				}
			}
		}
    </div>

## Usage and API

All you do is include it with `<script>`. CDN and packaging and stuff forthcoming.

It has two APIs:  The first, which is automatic, processes everything inside `divified` elements.
The second API is simply the `divify(x)` function, which can be used like `var html_str=divify(divifysource_str);`

There's also an `undivify(elemlist)` call which can be used in the console to convert from an existing `Element` instance to divify syntax in order to simplify migrations.

## Frameworks
You can also use it with string interpolation and javascript multiline template strings to implement
a really simple sort of UI component system or templates. (very rudimentary)

    //an example 'resource' component
	function resource(namelower,namefancy)
	{
		return divify(`
			.item {
				.ui .avatar .image img src="./img/${namelower}.png"
				.content {
					.header { "${namefancy}" } 
					#${namelower}_content {}
				}
			}
		`);
	}

## License

It uses the unlicense! Do what you want with it!
