activate :relative_assets

activate :fjords do |config|
  config.username = Bundler.settings["fjords_username"]
  config.password = Bundler.settings["fjords_password"]
  config.domain = "directory.middlemanapp.com"
  config.gzip_assets = true
  config.cdn = true
end

configure :build do
  activate :gzip
  activate :minify_css
  activate :minify_javascript
end

activate :livereload, :apply_js_live => false, :grace_period => 0.5