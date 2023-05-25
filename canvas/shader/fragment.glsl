uniform float time;
uniform float progress;
uniform sampler2D t1,t2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
  void main()	{
  vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
  vec4 i1 = texture2D(t1,newUV);
  vec4 i2 = texture2D(t2,newUV);
  // float dist = distance(i1,i2)/2.;
  float dist = distance(i1,i2)/1.;
  //dist = newUV.x + 0.1*sin(newUV.y*10. + time);
  float pr = step(dist,progress);
  vec4 final = mix(
		mix(i1, i2, pr),
		i2,
		pr
	);
  
    gl_FragColor = vec4(final);
  }