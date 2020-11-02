---
layout: post
title: 'Enumerators em Ruby'
date: 2017-08-26 12:47:26
description: 'Mas como assim, preciso de uma classe para fazer iterações?'
main-class: 'jekyll'
image: 'https://res.cloudinary.com/victorpre/image/upload/v1503798447/blogposts/Screen_Shot_2017-08-26_at_10.45.01_PM.png'
color: '#B31917'
tags:
  - ruby
  - backend  
twitter_text: 'Entendendo a classe Enumerator em ruby'
introduction: 'Enumerator: a classe que facilita iterações em ruby'
share_text: 'Compartilhe'
reading_time: 'read'
---


# Coleções

A primeira coisa que devem estar se perguntando é: *Mas como assim preciso de uma classe pra fazer um `for`?!*, mas fique calmo, vai dar tudo certo.. espero..

{:.blog-post-img}
![Keep Calm and Use Enumerator](https://res.cloudinary.com/victorpre/image/upload/c_scale,w_400/v1503849910/blogposts/keep-calm.png)

Na implementação da linguagem Ruby, existe sim a palavra reservada (*keyword*) `for`, então sim, ela pode sim ser utilizada para iterar em coleções
de modo similar a outras linguagens de programação:

{% highlight ruby  %}
  def print_for
    for c in ['w','a', 't','?']
      print c
    end
    print c
  end

   print_for # Prints 'wat??'
{% endhighlight %}

Reparem o último caracter que aparece na tela é `?`, isso acontece porque a variável `c` definida dentro do loop continua definida após a execução do bloco.

No entanto, em linguagens mais modernas, que são mais idiomáticas, existem outras maneiras de iterar em uma coleção, por exemplo, utilizando o `each` que é a
principal forma de iteração da linguagem onde muitos dos métodos a chamam internamente:

{% highlight ruby  %}
  def print_each
    ['w','a', 't','?'].each |c|
      print c
    end
  end

   print_each # Prints 'wat?'
{% endhighlight %}

Neste caso, a variável `c` existe apenas dentro do escopo do laço, caso tentássemos acessar seu valor fora do bloco, teríamos um erro: `NameError: undefined local variable or method 'c' for main:Object`

Mas existem outras formas mais performáticas e interessantes de percorrer um `Array`. Através da classe: `Enumerator` :grimacing:.

# Enumerator

Na verdade não existiria nada de excepcional nessa classe, se não fosse a inclusão do módulo `Enumerable` que implementa diversos métodos públicos para facilitar
a vida dos programadores.

### `map` e `collect`

Este dois métodos (um alias do outro) são muito utilizados no ruby: com eles é possível que um novo `Array` seja retornado contendo o valor retornado por cada iteração do bloco.
Isso significa que com eles conseguimos aplicar um trecho de código em todos os elementos da nossa coleção.


### Buscando em um `Enumerator`

Para fazer buscas, os dois métodos mais usados nessa classe são `find_all` e `select` onde ambos retornam uma coleção com os dados que atendem ao critério passado dentro do bloco. Vale notar que caso queria apenas um resultado, é recomendado que outros métodos sejam usados tais como o `find` por exemplo, que tem sua execução interrompida quando a condição é atingida.

Dentro da classe `Array` temos ainda o método `bsearch` que na verdade acaba sendo mais performático por utilizar um [algoritmo de busca binária](https://en.wikipedia.org/wiki/Binary_search_algorithm) em sua implementação:

{% highlight ruby %}
  BIG_NUM = 50_000_000
  require 'benchmark'
  Benchmark.bm do |x|
    x.report('find_all'){ (0..BIG_NUM).find_all{|x| x>BIG_NUM/20 }.first } # 4.514329s
    x.report('select'){(0..BIG_NUM).select{|x| x>BIG_NUM/20 }.first }      # 4.153905s
    x.report('find'){(0..BIG_NUM).find{|x| x>BIG_NUM/20 } }                # 0.146861s
    x.report('bsearch'){(0..BIG_NUM).bsearch{|x| x>BIG_NUM/20 } }          # 0.000005s
  end
{% endhighlight %}

### `reduce` e `inject`

Certo.. mas e se eu quiser acessar o resultado da iteração anterior? Para isso que esses métodos foram feitos! Pois na execução de seu bloco, é possível determinar um valor inicial (que também pode ser passado como parâmetro para os métodos):

{% highlight ruby  %}
  ['w', 'a', 't', '?'].reduce{|word, c| word + c } # Returns 'wat?'
{% endhighlight %}

Estes são só alguns dos métodos contidos neste módulo, existem vários outros métodos utilitários (i.e. `.any?`, `.reject`, `take`...).
Na dúvida de sintaxe ou de qual método utilizar ou também  se quiser saber mais, sempre recomendo visitar a [documentação do ruby](https://ruby-doc.org/core-2.4.1/Enumerable.html).


### Lazy

A partir da versão 2.0 do ruby, a funcionalidade `Enumerator::Lazy` foi implementada, o que permite a iteração em uma lista infinita acessando somente os elementos desejados. 
A ~~magia negra~~ explicação muito bem detalhada de como a implementação disso foi possível está muito bem escrita [nesse post](https://patshaughnessy.net/2013/4/3/ruby-2-0-works-hard-so-you-can-be-lazy)
, onde o autor mostra que por ele ser um `Enumerator` e responder para os métodos do módulo `Enumerable` recebe e expõe dados do mesmo tipo. Com isso é possível que uma *lazy evaluation* seja feita, onde, em um conjunto encadeado de operações, o ruby consegue
orquestrar as chamadas de métodos para que apenas uma quantidade necessária de execuções seja feita, veja no exemplo:

{% highlight ruby linenos %}
  require 'prime'
  infinite_range = (1..Float::INFINITY)
  infinite_range.lazy.select do |n|
    n.prime?
  end.take(50).to_a
  # Returns the first 50 prime numbers 
{% endhighlight %}

Parece mágico, não?

O que acontence na *lazy evaluation* é que a execução deste trecho de código, a linha `5` controla a quantidade de chamadas que o bloco `select` é executado.
Assim a execução é feita praticamente de traz pra frente.

Neste exemplo, o método `take` começa a iteração pelo `infinite_range` e quando tem a quantidade de elementos suficiente, gera uma exceção que interrompe o laço.

Espero que tenham entendido um pouco sobre as formas mais comuns de iteração em coleções em Ruby. Qualquer dúvida que tiverem postem nos comentários ou entrem em contato.


Além das que foram passadas no texto, abaixo vou colocar também umas outras boas referências sobre o assunto. :wink:

Abraços!



---

### Referências:

[What the Heck is a Ruby Enumerator?](https://rossta.net/blog/what-is-enumerator.html) 

[Blocos, Iteradores e Closures em Ruby](https://blogs.iwtraining.com.br/blocos-iteradores-e-closures-em-ruby/)

