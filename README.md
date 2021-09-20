# divify

Divify is a simple library to create a nicer syntax to build trees of elements in HTML5

This is useful in all kinds of elements like material, semantic, skeleton, bootstrap, etc.

For example, go from

	<div class="ui card">
	  <div class="image">
		<img src="/images/avatar2/large/kristy.png">
	  </div>
	  <div class="content">
		<a class="header">Kristy</a>
		<div class="meta">
		  <span class="date">Joined in 2013</span>
		</div>
		<div class="description">
		  Kristy is an art director living in New York.
		</div>
	  </div>
	  <div class="extra content">
		<a>
		  <i class="user icon"></i>
		  22 Friends
		</a>
	  </div>
	</div>
	
To 
	<div class="divified">
		ui card { 
			image { ^img src="/images/avatar2/large/kristy.png" {} }
			content {
				header ^a { $$Kristy$$ }
				meta { date ^span { $$Joined in 2013$$ } }
				description { $$Kristy is an art director living in New York$$ }
			}
			extra content {
				^a {
					user icon ^i {}
					$$22 Friends$$
				}
			}
		}
	</div>

This is just syntactic sugar, but the syntactic sugar is MUCH more readable.

It also is compatible with frameworks 

    <div class="divified">

    ui container #bob width=200 {       //makes a div with id "bob", classes "ui container", and an attribute width="200"
        ui internally celled grid {
       
            row {
                three wide column {
                    ui placeholder #icon { 
                        square image { } 
                        $$ Hello you dickback 

                        $$
                    }
                    ui placeholder { //This is a comment
                        paragraph { line { } line { } line{ } } 
                    }
                    ui placeholder { 
                        square image { } 
                    }
                }
            }
        }
    }

    </div>


	function resource(namelower,namefancy)
	{
		return divify(`
			item {
				ui avatar image ^img src="./img/${namelower}.png"
				content {
					header { $$ ${namefancy} $$ } 
					#${namelower}_content {}
				}
			}
		`);
	}