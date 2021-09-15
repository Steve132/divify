# divify
Simple plugin to build nested with a shorthand syntax

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
