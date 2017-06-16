import React from 'react'

export default function NewsletterSignUp({}) {
	return (
		<section>
			<script src="https://assets.convertkit.com/assets/CKJS4.js?v=21"></script>
			<div className="ck_form_container ck_inline" data-ck-version="6">
				<div className="ck_form ck_minimal">
				<div className="ck_form_fields">
					<h3 className="ck_form_title">Stay in touch</h3>
					<article className="ck_description">
						<p>Hear about new tools, updates, and guides.</p>
					</article>

					<div id="ck_success_msg"  style={{ display: 'none' }}>
						<p>Success! Now check your email to confirm your subscription.</p>
					</div>

					<form id="ck_subscribe_form" className="ck_subscribe_form" action="https://app.convertkit.com/landing_pages/156860/subscribe" data-remote="true">
						<input type="hidden" value="{&quot;form_style&quot;:&quot;minimal&quot;,&quot;embed_style&quot;:&quot;inline&quot;,&quot;embed_trigger&quot;:&quot;scroll_percentage&quot;,&quot;scroll_percentage&quot;:&quot;70&quot;,&quot;delay_seconds&quot;:&quot;10&quot;,&quot;display_position&quot;:&quot;br&quot;,&quot;display_devices&quot;:&quot;all&quot;,&quot;days_no_show&quot;:&quot;15&quot;,&quot;converted_behavior&quot;:&quot;show&quot;}" id="ck_form_options" />
						<input type="hidden" name="id" value="156860" id="landing_page_id" />
						<div className="ck_errorArea">
							<div id="ck_error_msg" style={{ display: 'none' }}>
								<p>There was an error submitting your subscription. Please try again.</p>
							</div>
						</div>
						<div className="ck_control_group ck_email_field_group">
							<label className="ck_label" htmlFor="ck_emailField" style={{ display: 'none' }}>Email</label>
							<input type="email" name="email" className="ck_email_address" id="ck_emailField" placeholder="Email" required />
						</div>
						<div className="ck_control_group ck_captcha2_h_field_group ck-captcha2-h" style={{ position: 'absolute', left: '-999em' }}>
							<input type="text" name="captcha2_h" className="ck-captcha2-h" id="ck_captcha2_h" placeholder="We use this field to detect spam bots. If you fill this in, you will be marked as a spammer." />
						</div>


						<button className="subscribe_button ck_subscribe_button btn fields" id="ck_subscribe_button">
							Sign Up
						</button>
					</form>
				</div>

			</div>

			</div>


			<style type="text/css">{ `/* Layout */
				.ck_form.ck_minimal {
				line-height: 1.5em;
				overflow: hidden;
				-webkit-box-shadow: none;
				-moz-box-shadow: none;
				box-shadow: none;
				clear: both;
				text-align: center;
			}


			.ck_form.ck_minimal h3.ck_form_title {
				text-align: center;
				margin: 0px 0px 10px;
			}

			.ck_form.ck_minimal h4 {
				text-align: center;
				font-family: 'Open Sans', Helvetica, Arial, sans-serif;
				text-transform: uppercase;
				font-weight: normal;
				padding-top: 0px;
				margin-top: 0px;
			}

			.ck_form.ck_minimal p {
				font-style: italic;
			}

			.ck_form.ck_minimal .ck_form_fields {
				width: 100%;
				float: left;
			}
			/* Form fields */

			.ck_errorArea {
				display: none; /* temporary */
			}

			#ck_success_msg {
				padding: 10px 10px 0px;
				border: solid 1px #ddd;
				background: #eee;
			}

			.ck_form.ck_minimal input[type="text"], .ck_form.ck_minimal input[type="email"] {
				font-size: 18px;
				padding: 10px 8px;
				width: 68%;
				border: 1px solid #d6d6d6; /* stroke */
				-moz-border-radius: 3px;
				-webkit-border-radius: 3px;
				border-radius: 3px; /* border radius */
				background-color: #fff; /* layer fill content */
				margin-bottom: 5px;
				height: auto;
				float: left;
				margin: 0px;
				margin-right: 2%;
				height: 42px;
			}

			.ck_form input[type="text"]:focus, .ck_form input[type="email"]:focus {
				outline: none;
				border-color: #aaa;
			}

			.ck_form.ck_minimal .ck_subscribe_button {
					width: 100%;
					color: #fff;
					margin: 0px;
					padding:  11px 0px;
					font-size: 18px;
					background: #ff3d76;
					-moz-border-radius: 3px;
					-webkit-border-radius: 3px;
					border-radius: 3px; /* border radius */
					cursor: pointer;
					border: none;
					text-shadow: none;
					width: 30%;
					float: left;
					height: 42px;
				}


			.ck_form.ck_minimal .ck_guarantee {
				color: #626262;
				font-size: 12px;
				text-align: center;
				padding: 15px 0px 0px;
				display: block;
				clear: both;
			}
			.ck_form .ck_powered_by {
				display: block;
				color: #aaa;
				font-size: 12px;
			}

			.ck_form .ck_powered_by:hover {
				display: block;
				color: #444;
			}

			.ck_converted_content {
				display: none;
				padding: 5%;
				background: #fff;
			}

			.ck_form.ck_minimal.width400 .ck_subscribe_button, .ck_form.ck_minimal.width400 input[type="email"] {
					width: 100%;
					float: none;
					margin-top: 5px;
				}

			.ck_slide_up, .ck_modal, .ck_slide_up .ck_minimal, .ck_modal .ck_minimal  {
				min-width: 400px;
			}

			.page .ck_form.ck_minimal {
				margin: 50px auto;
				max-width: 600px;
			}


			/* v6 */
			.ck_slide_up.ck_form_v6, .ck_modal.ck_form_v6, .ck_slide_up.ck_form_v6 .ck_minimal, .ck_modal.ck_form_v6 .ck_minimal {
				min-width: 0 !important;
			}

			@media all and (min-width: 801px) {
				.ck_modal.ck_form_v6 .ck_form.ck_minimal {
					margin-left: -300px;
					width: 600px;
				}
			}

			.ck_modal.ck_form_v6 .ck_minimal .ck_subscribe_form {
				padding-top: 20px;
			}

			.ck_slide_up.ck_form_v6 .ck_minimal .ck_subscribe_form {
				padding-top: 10px;
			}

			.ck_form_v6 #ck_success_msg {
				margin-top: 15px;
				padding: 0px 10px;
			}

			.ck_slide_up.ck_form_v6 .ck_minimal + .ck_close_link {
				top: 5px;
			}
			.ck_slide_up.ck_form_v6 .ck_minimal h3.ck_form_title {
				margin-top: 5px;
			}
			`}</style>
		</section>
	)
}
