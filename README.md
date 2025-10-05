# h_daCalProxy

A proxy for the personal calendar on the my.h-da.de portal, as it is currently broken and does not support the correct Accept headers

Sadly, importing the calendar directly, for example from a Nextcloud, is not possible because the server used by my.h-da.de creates an infinite redirect loop when the Accept header `text/html` is missing. Since ics is not `text/html`, this behavior is clearly wrong. Nextcloud also does not include this Accept header in its requests, so it fails. This proxy fixes the issue by adding the ~~correct~~ wanted Accept header and forwarding the request to my.h-da.de. The response is then sent back to the client.

## Usage

Start the server, then access `http://localhost:3000/<full-calendar-url>` to get your calendar. You can use this URL in your calendar application.  
A hosted instance is available at https://h-da-calproxy.vito0912.de/. Just append your calendar URL to this address. Requests are logged. Please see the [privacy policy](https://auth.dittmar-ldk.de/if/flow/datenschutz/).
