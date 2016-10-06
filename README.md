# meteor-ntlm-example

## Example Meteor app with Active Directory transparent password-less NTLM authentication

The goal of this project is to provide a **minimalistic** example of a Meteor app
using NTLM to transparently authenticate Active Directory users.


## Table of Contents

<!-- MarkdownTOC autolink=true bracket=round depth=3 -->

- [Previous art](#previous-art)
- [How it works](#how-it-works)
- [Requirements](#requirements)
- [How to run](#how-to-run)
- [Extending the current solution](#extending-the-current-solution)
- [IE Compatibility](#ie-compatibility)
- [License](#license)

<!-- /MarkdownTOC -->


## Previous art

The Meteor custom login handler was heavily inspired by a MeteorHacks article
"Extending Meteor Accounts (login system)" by @arunoda
(https://meteorhacks.com/extending-meteor-accounts). 


## How it works

The solution consists of two parts:

1. NTLM Authentication Proxy
1. Meteor app

The **NTLM Authentication Proxy** is basically just a simple `Express` app.
It authenticates the user using the `NodeSSPI` package
(https://github.com/abbr/NodeSSPI), then it uses the `http-proxy-middleware` package
(https://github.com/chimurai/http-proxy-middleware) to set the HTTP header `x-ntlm-user`
to the authenticated user's username (in a form of "DOMAIN\username")
and proxy the requests to the Meteor app. Even though in this demo project it runs
together with the Meteor app, it could be easily separated to run on a different host,
so you should actually be able to run the Authentication Proxy on a **Windows** host,
while the Meteor app is hosted on **Linux**.

On the **server side**, the **Meteor app** registers a custom login handler that uses the
Atmosphere `gadicohen:headers` package by @gadicc
to read the `x-ntlm-user` header and creates a new Meteor user account or loads an
existing one. On the **client side**, the login is being initiated early in the startup
phase.

As the account created is in fact a native Meteor user account, it could be immediately
used in publications, methods, etc. This demo app, for instance, uses the native
`Meteor.user()` method to display the logged in username.


## Requirements

1. **Windows** host for running at least the **NTLM Authentication Proxy** - 
*it inherits this requirement from its dependency package* - ***NodeSSPI***
1. The Windows host mentioned above must be a member of an **Active Directory Domain**
1. Meteor version 1.4.1.1


## How to run

```
git clone https://github.com/staskorz/meteor-ntlm-example.git
# or just download and extract the .zip
cd meteor-ntlm-example
meteor npm install
meteor
```

**Notice:** make sure to point the browser to the NTLM Authentication Proxy port,
which is **3030** in this example.


## Extending the current solution

1. As already mentioned, it's possible to run the NTLM Authentication Proxy on a
separate Windows machine, to make it possible to keep the Meteor app running on Linux
1. The moment the Meteor app is aware of the logged in user, it should be relatively
easy to use a package such as `node-activedirectory`
(https://github.com/gheeres/node-activedirectory) to load additional user properties
from Active Directory, i.e. group membership, in order to grant roles and permissions
within the application, etc.


## IE Compatibility

**Active Directory** means **Corporate Environments**, which in turn means
**Internet Explorer**.

Unless instructed otherwise, IE may switch to **Compatibility View** mode, which usually
makes it totally incompatible with modern webapps. Even IE11, the latest version,
has this issue. In order to force the IE out of Compatibility View mode, the following
**meta header** must be present between the `<head>` tags in the HTML:

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

The caveat is it **must** be the very first tag under `<head>`. As the native Meteor
webapp also inserts its own tags right under the `<head>`, a static `.html` file
containing a `<head>` section with the `<meta>` tag in question as the first line
won't do, but a package named `meteorhacks:inject-initial`
(https://github.com/meteorhacks/meteor-inject-initial) is required to do the trick:

```js
Inject.rawHead('my-meta', '<meta http-equiv="X-UA-Compatible" content="IE=edge">')
```

Everything mentioned up until this line is generic to every Meteor project requiring
IE compatibility, but there **is** a reason why it's all mentioned here:

The `gadicohen:headers` package internally also uses `meteorhacks:inject-initial`
package to insert a `<script>` tag containing the HTTP headers it makes available.
The problem is this tag is inserted as the first one in the `<head>` section,
pushing the `<meta>` tag required to force IE out of Compatibility View mode to the
second place, thus making it lose its effect, driving IE back to the Compatibility View
mode.

The only solution for this issue I've found so far was to manually modify the
`meteorhacks:inject-initial` package:

1. Download the sources of the `meteorhacks:inject-initial` package from
https://github.com/meteorhacks/meteor-inject-initial - **notice:** `git clone` may
fail on Windows due to the `:` (colon) character present in one of the folders,
in such case just download as `.zip`  file
1. Place the cloned/extracted sources in `/packages/meteor-inject-initial` folder
inside your Meteor project
1. Open `lib/inject-server.js` and scroll to the bottom of the file - **notice:** the line with `injectObjects` is the one injecting the `<script>` tag above
the `<meta>` one
1. Move the last line, the one with `injectObjects` above the one with `injectHeads` -
each line injects at the top, so moving it to be the first actually pushes the tags
it creates to the bottom, which is exactly what's required to regain IE compatibility
1. After the Meteor app is restarted, the locally modified package will be used
instead of the one from Atmosphere, thus resolving the IE compatibility issue


## License

The MIT License (MIT)

Copyright (c) 2016 Stas (Stanislav) Korzovsky

